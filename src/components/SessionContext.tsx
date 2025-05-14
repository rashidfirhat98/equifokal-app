"use client";

import { Session } from "next-auth";
import React, { createContext, useContext } from "react";

const SessionContext = createContext<Session | null>(null);

export const useSessionContext = () => useContext(SessionContext);

export function SessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
