import { useMemo } from 'react';
import rawMetadata from '../../metadata.json';

function useMetadata() {
  return useMemo(() => rawMetadata, []);
}

export default useMetadata;

