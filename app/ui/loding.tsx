import React from 'react';

export default function LoadingContianer({
  children,
  loading,
  error,
}: {
  children: React.ReactNode;
  loading: boolean;
  error?: Error;
}) {
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center">
          <div className="text-red-500">{error.message}</div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
