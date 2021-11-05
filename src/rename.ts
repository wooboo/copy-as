import preserveCase from "preserve-case";

export default function (
  value: string,
  rename: { from: string; to: string }[],
  noPreserveCase: boolean
) {
  let result = value;
  for (let index = 0; index < rename.length; index++) {
    const ren = rename[index];
    if (noPreserveCase) {
      result = result.split(ren.from).join(ren.to);
    } else {
      result = preserveCase.all(result, ren.from, ren.to);
    }
  }
  return result;
}
