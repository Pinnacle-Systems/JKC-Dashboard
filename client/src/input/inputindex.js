const RequiredLabel = ({ name }) => (
  <p>
    {`${name}`}
    <span className="text-red-500">*</span>{" "}
  </p>
);
export default RequiredLabel