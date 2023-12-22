import { use, useEffect, useState } from 'react';

export default function Humanity({ messages }: { messages: string }) {
  const [text, setText] = useState('');
  useEffect(() => {
    fetch('/dashboard/transcriptions/api', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
      .then((res) => res.json())
      .then((data) => {
        setText(data.result);
      });
  }, [messages]);

  return <pre className="whitespace-normal">{text}</pre>;
}
