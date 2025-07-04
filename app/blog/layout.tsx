import { BlogNav } from "./nav";
import path from "path";
import fs from "fs";

const categories = fs.readdirSync(path.join(process.cwd(), "content/blog"));

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={`space-y-6 pt-6 md:pt-12`}>
      <BlogNav categories={categories} />
      {children}
    </div>
  );
};

export default BlogLayout;
