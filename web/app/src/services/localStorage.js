export const fetchNatureDetailsbyId = async (natureId) => {
  try {
    const natureDetails = await localStorage.getItem(`excelData` || []);
    return natureDetails.find((nature) => nature.id === natureId);
  } catch (e) {
    console.error("Error getting nature details from localForage: ", e);
    return null;
  }
};
