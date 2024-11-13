import { UserOutlined, PhoneOutlined, MailOutlined, OrderedListOutlined } from '@ant-design/icons';

export default function BATable(props) {
  const { data, columns } = props;

  const getColumnIcon = (key) => {
    switch (key) {
      case 'name':
        return <UserOutlined className="mr-2" />;
      case 'phone':
        return <PhoneOutlined className="mr-2" />;
      case 'email':
        return <MailOutlined className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3 text-left text-sm font-semibold border-b border-gray-300 uppercase tracking-wider">
              <OrderedListOutlined className="mr-1" />
            </th>
            {columns.map((column, index) => (
              <th key={index} className="p-3 text-left text-sm font-semibold border-b border-gray-300 uppercase tracking-wider">
                <div className="flex items-center">
                  {getColumnIcon(column.key)}
                  {column.label}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0  ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100 transition duration-200">
                <td className="p-3 border-b border-gray-300 text-gray-800 w-16">
                  {rowIndex + 1}
                </td>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="p-3 border-b border-gray-300">
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="p-3 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}