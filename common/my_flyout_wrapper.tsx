import React from 'react';

interface FieldValue {
  fieldName: string;
  rawValue: any;
  formattedValue: string;
  isJson: boolean;
}

function isJsonString(str: string): boolean {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}

function formatJsonValue(value: any): { isJson: boolean; formatted: string } {
  // If it's already an object, format it
  if (typeof value === 'object' && value !== null) {
    return {
      isJson: true,
      formatted: JSON.stringify(value, null, 2)
    };
  }

  // If it's a string, check if it's JSON
  if (typeof value === 'string') {
    if (isJsonString(value)) {
      try {
        const parsed = JSON.parse(value);
        return {
          isJson: true,
          formatted: JSON.stringify(parsed, null, 2)
        };
      } catch {
        return { isJson: false, formatted: value };
      }
    }
    return { isJson: false, formatted: value };
  }

  // Other types (number, boolean, etc.)
  return { isJson: false, formatted: String(value) };
}

function extractFieldsFromHit(hit: any, dataView: any): FieldValue[] {
  const fields: FieldValue[] = [];
  
  // Get all field names from dataView (if available)
  const dataViewFields = dataView?.fields?.getAll?.() || [];
  
  // Process fields from hit.fields (flattened format)
  if (hit.fields) {
    Object.keys(hit.fields).forEach(fieldName => {
      const rawValue = hit.fields[fieldName];
      const actualValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
      
      // Check if this field has JSON format in dataView
      const field = dataViewFields.find((f: any) => f.name === fieldName);
      const hasJsonFormat = field?.format?.id === 'json' || field?.type === 'json';
      
      const { isJson, formatted } = formatJsonValue(actualValue);
      
      fields.push({
        fieldName,
        rawValue: actualValue,
        formattedValue: formatted,
        isJson: isJson || hasJsonFormat
      });
    });
  }
  
  // Process fields from hit._source (nested format)
  if (hit._source) {
    Object.keys(hit._source).forEach(fieldName => {
      // Skip if already processed from hit.fields
      if (hit.fields && hit.fields[fieldName] !== undefined) {
        return;
      }
      
      const rawValue = hit._source[fieldName];
      const field = dataViewFields.find((f: any) => f.name === fieldName);
      const hasJsonFormat = field?.format?.id === 'json' || field?.type === 'json';
      
      const { isJson, formatted } = formatJsonValue(rawValue);
      
      fields.push({
        fieldName,
        rawValue,
        formattedValue: formatted,
        isJson: isJson || hasJsonFormat
      });
    });
  }
  
  return fields;
}

export const MyFlyoutWrapper = (props: any) => {
  const { hit, dataView } = props;
  
  console.log('📄 Hit:', hit);
  console.log('📊 DataView:', dataView);
  
  const allFields = extractFieldsFromHit(hit, dataView);
  
  // Filter only JSON fields (if you want ONLY JSON fields, uncomment the filter)
  // const jsonFields = allFields.filter(f => f.isJson);
  const jsonFields = allFields; // Show all fields for now
  
  console.log('🔍 Extracted fields:', jsonFields);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        background: '#f5f7fa',
        borderBottom: '1px solid #d3dae6',
        color: '#343741',
        fontSize: '14px',
        fontWeight: 600
      }}>
        🔧 Custom JSON View - Document: {hit._id}
      </div>

      {/* Content */}
      <div style={{ 
        padding: '16px', 
        overflowY: 'auto',
        flex: 1
      }}>
        {jsonFields.length === 0 ? (
          <div style={{ color: '#98a2b3', fontStyle: 'italic' }}>
            No fields found in this document
          </div>
        ) : (
          jsonFields.map((field, idx) => (
            <div key={idx} style={{ marginBottom: '16px' }}>
              {/* Field Name */}
              <div style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#343741',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {field.fieldName}
                {field.isJson && (
                  <span style={{
                    background: '#0077cc',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    fontSize: '10px',
                    fontWeight: 500
                  }}>
                    JSON
                  </span>
                )}
              </div>

              {/* Field Value */}
              <pre style={{
                margin: 0,
                padding: '12px',
                background: field.isJson ? '#f0f7ff' : '#fcfcfd',
                border: field.isJson ? '1px solid #0077cc' : '1px solid #d3dae6',
                borderRadius: '4px',
                fontSize: '11px',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: '#343741',
                fontFamily: 'monospace'
              }}>
                {field.formattedValue}
              </pre>
            </div>
          ))
        )}
      </div>

      {/* Footer with stats */}
      <div style={{
        padding: '8px 16px',
        background: '#f5f7fa',
        borderTop: '1px solid #d3dae6',
        fontSize: '11px',
        color: '#69707d'
      }}>
        Showing {jsonFields.length} field(s) · {jsonFields.filter(f => f.isJson).length} JSON field(s)
      </div>
    </div>
  );
};
