import PropTypes from "prop-types";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col justify-between min-h-dvh">
      <nav className="bg-gray-300">
        <h3 className="px-4 py-3 font-medium">RapidQuest</h3>
      </nav>
      <main className="flex-1">{children}</main>
      <footer>
        <p className="text-center bg-gray-700 text-white">
          Copyright RapidQuest 2024
        </p>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
