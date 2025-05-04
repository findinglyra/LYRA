
import { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const Layout = ({ children, showNav = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-20">{children}</main>
      {showNav && <Navigation />}
    </div>
  );
};

export default Layout;
