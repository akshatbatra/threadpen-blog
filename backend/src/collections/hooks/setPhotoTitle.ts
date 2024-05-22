
export default async ({data, value, previousValue}) => {
    if (value !== previousValue) {
      data.title = value; 
      return value;
    }
}