import React, { useState, useMemo } from 'react';
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
  EuiCodeBlock,
} from '@elastic/eui';
import type { DataView } from '@kbn/data-views-plugin/public';

interface MyFlyoutWrapperProps {
  hit: any;
  dataView: DataView;
}

export const MyFlyoutWrapper: React.FC<MyFlyoutWrapperProps> = ({ hit, dataView }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Extract all fields that have fieldFormatMap set to 'json'
  const jsonFormattedFields = useMemo(() => {
    const fieldFormatMap = dataView.fieldFormatMap || {};
    const jsonFields: Array<{ fieldName: string; value: any; formattedValue: any; parseError?: string }> = [];

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
            
            jsonFields.push({
              fieldName,
              value,
              formattedValue: parsedValue,
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
              <EuiBadge color="hollow">{jsonFormattedFields.length} field{jsonFormattedFields.length !== 1 ? 's' : ''}</EuiBadge>
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
                  <EuiCodeBlock language="text" fontSize="s" paddingSize="m">
                    {typeof currentFieldData.value === 'string' 
                      ? currentFieldData.value 
                      : JSON.stringify(currentFieldData.value)}
                  </EuiCodeBlock>
                </EuiPanel>
              ) : (
                <EuiCodeBlock 
                  language="json" 
                  fontSize="m" 
                  paddingSize="m"
                  isCopyable
                  overflowHeight={500}
                >
                  {JSON.stringify(currentFieldData.formattedValue, null, 2)}
                </EuiCodeBlock>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};