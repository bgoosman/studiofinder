// Requires asset/resource loader in webpack.config.js
// import DanceImage from "../static/synthwave-luscious-studio-transparent-compressed.png";

export const Logo = ({ className, onClick }: { className?: string; onClick?: () => void }) => (
  <img
    src={"/synthwave-luscious-studio-transparent-compressed.png"}
    alt="Studio Finder Logo"
    className={className}
    onClick={onClick}
  />
);
