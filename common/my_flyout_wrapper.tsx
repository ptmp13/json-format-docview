import React from 'react';

function getFormattedJson(doc: Record<string, any>) {
  // Example: access a specific field or the whole source
  console.log(doc);
  // const value = doc._source?.my_field_name || '';

  try {
    // const obj = typeof value === 'string' ? JSON.parse(value) : value;
    return {
      isJson: true,
      // value: JSON.stringify(obj, null, 2)
    };
  } catch {
    return { isJson: false, value: String("trtrt") };
  }
}


export const MyFlyoutWrapper = (props: any) => {
  // According to your screenshot, the document is in 'hit'
  // const { hit } = props;
  const { hit, dataView } = props;
  console.log(hit)
  if (!hit) {
    return <div style={{ padding: '16px' }}>No document data found.</div>;
  }
  const jsonField = dataView.fields.find((f: any) =>
    f.format?.type?.id === 'JsonContent' || f.format?._type === 'JsonContent'
  );
  console.log(jsonField );
  console.log('Available fields in this hit:', Object.keys(hit.fields || {}));
  console.log('Available fields in source:', Object.keys(hit._source || {}));

  // Get the entire source object dynamically
  const fullDoc = hit._source;
  const formattedJson = JSON.stringify(fullDoc, null, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '8px 16px',
        background: '#f5f7fa',
        borderBottom: '1px solid #d3dae6',
        color: '#343741',
        fontSize: '12px'
      }}>
        🔧 <strong>Plugin View:</strong> Document {hit._id}
      </div>

      <div style={{ padding: '16px' }}>
        <pre style={{
          margin: 0,
          padding: '12px',
          background: '#fcfcfd',
          border: '1px solid #d3dae6',
          borderRadius: '4px',
          fontSize: '11px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>
          {formattedJson}
        </pre>
      </div>
    </div>
  );
};
