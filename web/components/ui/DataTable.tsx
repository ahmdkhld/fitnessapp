import React from 'react';

interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  style?: React.CSSProperties;
}

const cellStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  borderBottom: '1px solid #333333',
  textAlign: 'left',
  fontSize: 14,
  color: '#FFFFFF',
  fontFamily: "'Inter', sans-serif",
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontSize: 12,
  fontWeight: 600,
  color: '#A9A9A9',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  background: '#121212',
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = 'No data',
  style,
}: DataTableProps<T>) {
  return (
    <div
      style={{
        overflowX: 'auto',
        background: '#1E1E1E',
        border: '1px solid #333333',
        borderRadius: 12,
        ...style,
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: columns.length * 120,
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={headerCellStyle}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  ...cellStyle,
                  textAlign: 'center',
                  color: '#A9A9A9',
                  padding: '2rem 1rem',
                  borderBottom: 'none',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#1E1E1E' : '#191919' }}>
                {columns.map((col) => (
                  <td key={col.key} style={i === data.length - 1 ? { ...cellStyle, borderBottom: 'none' } : cellStyle}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : (row[col.key] as React.ReactNode) ?? '\u2014'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
