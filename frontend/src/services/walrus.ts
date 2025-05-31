import axios from 'axios';

const WALRUS_API = 'https://api.walrus.gg/v1';

export const uploadToWalrus = async (
  content: string, 
  apiKey: string
): Promise<{ cid: string }> => {
  const formData = new FormData();
  const blob = new Blob([content], { type: 'text/markdown' });
  formData.append('file', blob, 'content.md');

  const response = await axios.post(`${WALRUS_API}/blobs/upload`, formData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'multipart/form-data'
    }
  });

  return { cid: response.data.cid };
};

export const fetchFromWalrus = async (cid: string): Promise<string> => {
  const response = await axios.get(`https://${cid}.ipfs.walrus.gg`);
  return response.data;
};