/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import LoadSpinner from "@/components/molecules/LoadSpinner";

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTablesProps {
  title?: string;
  description?: string;
  columns: Column[];
  data: Record<string, any>[];
  onExport?: () => void;
  isLoading?: boolean;
}

const DataTables: FC<DataTablesProps> = ({
  title = "Data Table",
  description,
  columns,
  data,
  onExport,
  isLoading,
}) => {
  return (
    <div className="mt-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-2 text-md text-gray-700">{description}</p>
          )}
        </div>
        {onExport && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              onClick={onExport}
              className="block rounded-md bg-indigo-600 px-4 py-3 text-center text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Export
            </button>
          </div>
        )}
      </div>
      {isLoading && <LoadSpinner />}

      {!isLoading && (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-7 lg:px-9">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="whitespace-nowrap px-5 py-4 text-left text-md font-semibold text-gray-900 first:pl-4 first:pr-3 first:sm:pl-0"
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {columns.map((column) => (
                        <td
                          key={`${row.id || rowIndex}-${column.key}`}
                          className="whitespace-nowrap p-4 text-md text-gray-500 first:pl-4 first:pr-3 first:sm:pl-0"
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : row[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTables;
