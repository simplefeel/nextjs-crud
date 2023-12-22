'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRequest } from 'ahooks';
import LoadingContianer from '../loding';
import { HttpResponseType } from '@/app/lib/types';

export default function Summary({ messages }: { messages: string }) {
  const { data, error, loading } = useRequest(fetchSummary);

  function fetchSummary(): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .post<HttpResponseType<string>>(
          '/dashboard/transcriptions/summary/api',
          {
            messages,
          },
        )
        .then((res) => {
          if (res.data.status.code == 0) {
            resolve(res.data.result);
          } else {
            reject(new Error(res.data.status.message));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  return (
    <LoadingContianer loading={loading} error={error}>
      <pre className="whitespace-normal">{data}</pre>
    </LoadingContianer>
  );
}
