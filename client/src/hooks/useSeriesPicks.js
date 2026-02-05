import { useEffect, useState } from 'react';
import { fetchSeriesDraft, fetchSeriesCommitted } from '../api.js';
import { supabase } from '../supabaseClient.js';

export default function useSeriesPicks(token) {
  const [drafts, setDrafts] = useState([]);
  const [committed, setCommitted] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      const tokenToUse = token || (await supabase.auth.getSession()).data.session?.access_token;
      if (!tokenToUse) return;
      setLoading(true);
      try {
        const [draftData, committedData] = await Promise.all([
          fetchSeriesDraft(tokenToUse),
          fetchSeriesCommitted(tokenToUse),
        ]);
        if (!active) return;
        setDrafts(draftData || []);
        setCommitted(committedData || []);
        setError('');
      } catch (err) {
        if (!active) return;
        setError(err?.message || 'Failed to load series picks.');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [token]);

  return { drafts, committed, setDrafts, setCommitted, loading, error };
}
