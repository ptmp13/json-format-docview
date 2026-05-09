import React, { useState, useMemo, ReactElement } from 'react';
import {
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiContextMenu,
  EuiPopover,
  EuiButtonEmpty,
  EuiBadge,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import type { DataView } from '@kbn/data-views-plugin/public';
import { CodeEditor } from '@kbn/code-editor';
import type { DocViewRenderProps } from '@kbn/unified-doc-viewer-plugin/public';

// Import the CSS file
import '../public/monokai_theme.scss';

// Custom Highlighted CodeEditor Component
const HighlightedCodeEditor: React.FC<{
  value: string;
  highlightedValue: string;
  formattedValue: any;
}> = ({ value, highlightedValue, formattedValue }) => {
  const { jsonString, decorations } = useMemo(() => {
    const jsonStr = JSON.stringify(formattedValue, null, 2);
    
    // Find highlighted terms
    const highlightRegex = /@kibana-highlighted-field@(.*?)@\/kibana-highlighted-field@/g;
    const matches = [...highlightedValue.matchAll(highlightRegex)];
    
    if (matches.length === 0) {
      return { jsonString: jsonStr, decorations: [] };
    }
    
    // Find all occurrences of highlighted terms in the JSON string
    const decorationsList: any[] = [];
    const lines = jsonStr.split('\n');
    
    matches.forEach((match) => {
      const term = match[1];
      
      lines.forEach((line, lineIndex) => {
        let columnIndex = 0;
        let searchIndex = 0;
        
        while ((searchIndex = line.indexOf(term, columnIndex)) !== -1) {
          decorationsList.push({
            range: {
              startLineNumber: lineIndex + 1,
              startColumn: searchIndex + 1,
              endLineNumber: lineIndex + 1,
              endColumn: searchIndex + term.length + 1,
            },
            options: {
              inlineClassName: 'monaco-highlight-search-term',
              className: 'monaco-highlight-search-term-line',
            },
          });
          
          columnIndex = searchIndex + term.length;
        }
      });
    });
    
    return { jsonString: jsonStr, decorations: decorationsList };
  }, [formattedValue, highlightedValue]);

  return (
    <div className="monaco-editor-dark-custom">
      <EuiPanel 
        hasBorder 
        paddingSize="none" 
        style={{ 
          overflow: 'hidden',
          backgroundColor: '#2d2a2e',
        }}
      >
        <CodeEditor
          languageId="json"
          value={jsonString}
          onChange={() => {}}
          editorDidMount={(editor) => {
            // Apply dark theme to editor container FIRST
            const editorElement = editor.getDomNode();
            if (editorElement) {
              // Find the actual editor container
              const editorContainer = editorElement.querySelector('.monaco-editor');
              if (editorContainer) {
                editorContainer.classList.add('monaco-editor-dark-custom');
              }
              // Also add to the root element
              editorElement.classList.add('monaco-editor-dark-custom');
            }
            
            // Apply decorations after editor mounts
            if (decorations.length > 0) {
              editor.deltaDecorations([], decorations);
            }
          }}
          options={{
            readOnly: true,
            lineNumbers: 'on',
            fontSize: 13,
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            automaticLayout: true,
            fixedOverflowWidgets: true,
            folding: true,
            renderLineHighlight: 'none',
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            theme: 'vs-dark',
            matchBrackets: 'always',
            bracketPairColorization: {
              enabled: true,
            },
          }}
          height="500px"
        />
      </EuiPanel>
    </div>
  );
};

export const MyFlyoutWrapper = ({ hit, dataView }: DocViewRenderProps): ReactElement => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Extract all fields that have fieldFormatMap set to 'json'
  const jsonFormattedFields = useMemo(() => {
    const fieldFormatMap = dataView.fieldFormatMap || {};
    const jsonFields: Array<{ 
      fieldName: string; 
      value: any; 
      formattedValue: any; 
      highlightedValue?: string;
      parseError?: string;
    }> = [];

    // Get highlights from hit
    const highlights = hit.raw?.highlight || {};

    // Iterate through fieldFormatMap to find fields with 'json' format
    Object.entries(fieldFormatMap).forEach(([fieldName, format]: [string, any]) => {
      if (format?.id === 'json') {
        // Get the raw value from the hit
        const rawValue = hit.flattened?.[fieldName] || hit.raw?.fields?.[fieldName];
        
        if (rawValue !== undefined && rawValue !== null) {
          try {
            // Try to parse the JSON string
            const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
            const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
            
            // Check if this field has highlights
            const highlightValue = highlights[fieldName]?.[0];
            
            jsonFields.push({
              fieldName,
              value,
              formattedValue: parsedValue,
              highlightedValue: highlightValue,
            });
          } catch (e) {
            // If parsing fails, show error
            jsonFields.push({
              fieldName,
              value: rawValue,
              formattedValue: rawValue,
              parseError: e instanceof Error ? e.message : 'Parse error',
            });
          }
        }
      }
    });

    return jsonFields;
  }, [hit, dataView]);

  // Set initial selected field
  React.useEffect(() => {
    if (jsonFormattedFields.length > 0 && !selectedField) {
      setSelectedField(jsonFormattedFields[0].fieldName);
    }
  }, [jsonFormattedFields, selectedField]);

  // Get currently selected field data
  const currentFieldData = useMemo(() => {
    return jsonFormattedFields.find((field) => field.fieldName === selectedField);
  }, [jsonFormattedFields, selectedField]);

  // Create context menu panels
  const panels = useMemo(
    () => [
      {
        id: 0,
        title: 'Select JSON Field',
        items: jsonFormattedFields.map((field) => ({
          name: (
            <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
              <EuiFlexItem grow={false}>
                <span>{field.fieldName}</span>
              </EuiFlexItem>
              {field.highlightedValue && (
                <EuiFlexItem grow={false}>
                  <EuiBadge color="warning" iconType="searchProfilerApp">
                    Match
                  </EuiBadge>
                </EuiFlexItem>
              )}
              {field.parseError && (
                <EuiFlexItem grow={false}>
                  <EuiBadge color="danger" iconType="alert">
                    Error
                  </EuiBadge>
                </EuiFlexItem>
              )}
            </EuiFlexGroup>
          ),
          icon: selectedField === field.fieldName ? 'check' : 'empty',
          onClick: () => {
            setSelectedField(field.fieldName);
            setIsPopoverOpen(false);
          },
        })),
      },
    ],
    [jsonFormattedFields, selectedField]
  );

  const contextMenuButton = (
    <EuiButtonEmpty
      iconType="arrowDown"
      iconSide="right"
      onClick={() => setIsPopoverOpen(!isPopoverOpen)}
      size="s"
      color="primary"
    >
      {selectedField || 'Select Field'}
    </EuiButtonEmpty>
  );

  return (
    <div style={{ padding: '16px', height: '100%' }}>
      {jsonFormattedFields.length === 0 ? (
        <EuiPanel color="subdued" borderRadius="m">
          <EuiText color="subdued" textAlign="center">
            <p>No fields with JSON format found in this document</p>
          </EuiText>
        </EuiPanel>
      ) : (
        <>
          <EuiFlexGroup alignItems="center" gutterSize="s" responsive={false}>
            <EuiFlexItem grow={false}>
              <EuiPopover
                button={contextMenuButton}
                isOpen={isPopoverOpen}
                closePopover={() => setIsPopoverOpen(false)}
                panelPaddingSize="none"
                anchorPosition="downLeft"
              >
                <EuiContextMenu initialPanelId={0} panels={panels} />
              </EuiPopover>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiBadge color="hollow">
                {jsonFormattedFields.length} field{jsonFormattedFields.length !== 1 ? 's' : ''}
              </EuiBadge>
            </EuiFlexItem>
          </EuiFlexGroup>

          <EuiSpacer size="m" />

          {currentFieldData && (
            <>
              {currentFieldData.parseError ? (
                <EuiPanel color="danger" hasBorder>
                  <EuiText color="danger">
                    <h4>Parse Error</h4>
                    <p>{currentFieldData.parseError}</p>
                  </EuiText>
                  <EuiSpacer size="s" />
                  <EuiText size="s">
                    <strong>Raw value:</strong>
                  </EuiText>
                  <pre style={{ 
                    fontSize: '12px', 
                    overflow: 'auto',
                    backgroundColor: '#2d2a2e',
                    color: '#fcfcfa',
                    padding: '12px',
                    borderRadius: '4px',
                  }}>
                    {typeof currentFieldData.value === 'string' 
                      ? currentFieldData.value 
                      : JSON.stringify(currentFieldData.value)}
                  </pre>
                </EuiPanel>
              ) : currentFieldData.highlightedValue ? (
                // Show highlighted version with Monaco
                <HighlightedCodeEditor
                  value={currentFieldData.value}
                  highlightedValue={currentFieldData.highlightedValue}
                  formattedValue={currentFieldData.formattedValue}
                />
              ) : (
                // No highlights, show normal Monaco editor with dark theme
                <div className="monaco-editor-dark-custom">
                  <EuiPanel 
                    hasBorder 
                    paddingSize="none" 
                    style={{ 
                      overflow: 'hidden',
                      backgroundColor: '#2d2a2e',
                    }}
                  >
                    <CodeEditor
                      languageId="json"
                      value={JSON.stringify(currentFieldData.formattedValue, null, 2)}
                      onChange={() => {}}
                      editorDidMount={(editor) => {
                        const editorElement = editor.getDomNode();
                        if (editorElement) {
                          // Find the actual editor container
                          const editorContainer = editorElement.querySelector('.monaco-editor');
                          if (editorContainer) {
                            editorContainer.classList.add('monaco-editor-dark-custom');
                          }
                          // Also add to the root element
                          editorElement.classList.add('monaco-editor-dark-custom');
                        }
                      }}
                      options={{
                        readOnly: true,
                        lineNumbers: 'on',
                        fontSize: 13,
                        fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        wrappingIndent: 'indent',
                        automaticLayout: true,
                        fixedOverflowWidgets: true,
                        folding: true,
                        renderLineHighlight: 'none',
                        scrollbar: {
                          vertical: 'auto',
                          horizontal: 'auto',
                          useShadows: false,
                          verticalScrollbarSize: 10,
                          horizontalScrollbarSize: 10,
                        },
                        theme: 'vs-dark',
                        matchBrackets: 'always',
                        bracketPairColorization: {
                          enabled: true,
                        },
                      }}
                      height="500px"
                    />
                  </EuiPanel>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};