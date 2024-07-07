import { useRef } from "react";

const wrapPromiseState = <T>(promise: Promise<T>) => {
  let status = "pending";
  let result: T | null = null;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw result;
      return result;
    },
  };
};

export const useModuleImportSuspense = <T>(modules: () => T[]) => {
  const modulesFnRef = useRef<{ read: () => Awaited<T>[] | null } | null>(null);

  if (!modulesFnRef.current) {
    const promise = Promise.all(modules());
    modulesFnRef.current = wrapPromiseState(promise);
  }

  return modulesFnRef.current.read()!;
};
