import { v4 as uuidv4 } from "uuid";

export const generateShortUUID = () => {
  const uuid = uuidv4();
  const base64UUID = btoa(uuid).replace(/[^a-zA-Z0-9]/g, "");
  return base64UUID.substring(0, 11);
};
