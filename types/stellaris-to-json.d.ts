declare module 'stellaris-to-json' {
  /**
   * Converts a Stellaris data file to JSON.
   * @param  text Text contents of the Stellaris data file.
   * @returns JSON string with the input data. If an empty string is passed to `text`, this will be an empty object.
   */
  export function convert(text: string): string;
}
