import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useModuleImportSuspense } from "./module/useModuleImport";
import { Suspense, useCallback, useRef } from "react";

const inter = Inter({ subsets: ["latin"] });

const TestComponent = () => {
  const stateCheck = useRef(false);

  console.log("HELLO THERE --->", stateCheck.current);
  
  if (!stateCheck.current) {
    stateCheck.current = true;
  }

  const callback = useCallback(
    () => [
      new Promise((resolve) => resolve({ Test: () => "Test" })) as Promise<{
        Test: () => string;
      }>,
    ],
    []
  );
  const [state] = useModuleImportSuspense(callback);

  return <div>Test {state.Test()} </div>;
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestComponent />
    </Suspense>
  );
}
