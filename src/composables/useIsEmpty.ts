interface IsEmptyInterface {
  (val: string | undefined | null | any[] | Record<string, any>): boolean;
}

export const useIsEmpty = () => { // The named container

  // A container method
  const isEmpty: IsEmptyInterface = (val) => {
    return (
      val === 0 || val === undefined || val === null ||
      (typeof val === 'string' && val.trim().length === 0) ||
      (Array.isArray(val) && val.length === 0) ||
      (typeof val === 'object' && Object.keys(val).length === 0)
    );
  };

  return { isEmpty } // Expose as public interface 
}