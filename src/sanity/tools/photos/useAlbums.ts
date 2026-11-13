import { useCallback, useEffect, useRef, useState } from "react";
import type { SanityClient } from "sanity";

import { ALBUMS_QUERY, LISTEN_QUERY } from "./api";
import type { Album } from "./types";

/**
 * All published albums, kept fresh: refetched after any change to an album,
 * whether it came from this tool, the regular editor, or another admin.
 * `update` applies an optimistic local change until the refetch lands.
 */
export function useAlbums(client: SanityClient) {
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(() => {
    return client
      .fetch<Album[]>(ALBUMS_QUERY)
      .then((result) => {
        setAlbums(result);
        setError(null);
        return result;
      })
      .catch((err: Error) => {
        setError(err.message);
        return null;
      });
  }, [client]);

  useEffect(() => {
    refresh();
    const subscription = client
      .listen(LISTEN_QUERY, {}, { visibility: "query", events: ["mutation"], includeResult: false })
      .subscribe(() => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(refresh, 250);
      });
    return () => {
      subscription.unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [client, refresh]);

  const update = useCallback((albumId: string, change: (album: Album) => Album) => {
    setAlbums((current) =>
      current ? current.map((album) => (album._id === albumId ? change(album) : album)) : current
    );
  }, []);

  return { albums, error, refresh, update };
}
