export function useCodination() {
  const addNewCodination = (cloths: ClosetCloth[]) => {
    return {
      id: new Date().getTime().toString(),
      fitting_image: null,
      cloths: cloths,
    };
  };

  return { addNewCodination };
}
