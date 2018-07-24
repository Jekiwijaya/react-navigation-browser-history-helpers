export default function stubFunc(W){
  return ({basePath, ...rest}) => (
    <W {...rest} />
  );
};