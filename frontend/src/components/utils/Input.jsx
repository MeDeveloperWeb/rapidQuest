import PropTypes from "prop-types";

export function Input({ label, id, ...props }) {
  return (
    <div className="relative border border-black min-w-fit rounded-md">
      <label
        htmlFor={id}
        className="absolute -top-3 left-2 z-10 bg-white px-1 text-sm"
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="py-3 px-4 h-full w-full rounded-md"
      />
    </div>
  );
}

export function Select({ label, id, children, ...props }) {
  return (
    <div className="relative border border-black min-w-fit rounded-md">
      <label
        htmlFor={id}
        className="absolute -top-3 left-2 z-10 bg-white px-1 text-sm text-nowrap whitespace-nowrap"
      >
        {label}
      </label>
      <select
        id={id}
        {...props}
        className="py-3 px-4 h-full w-full bg-white rounded-md"
      >
        {children}
      </select>
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
};

Select.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
};
