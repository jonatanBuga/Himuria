import { useEffect, useState } from 'react';
import { fetchSeasonCommitted, fetchSeasonDraft } from '../api.js';

export default function useSeasonPicks(token) {
  const [draft, setDraft] = useState(null);
  const [committed, setCommitted] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    Promise.all([fetchSeasonDraft(token), fetchSeasonCommitted(token)])
      .then(([draftData, committedData]) => {
        if (!active) return;
        setDraft(draftData);
        setCommitted(committedData);
      })
      .catch(() => {
        if (!active) return;
        setDraft(null);
        setCommitted(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  return { draft, committed, setDraft, setCommitted, loading };
}
