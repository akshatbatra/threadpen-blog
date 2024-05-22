export default async ({req, operation}) => {
  if ((operation === "create") || (operation === "update")) {
    let fileName =  req.files.file?.name;
    let dashedFileName = fileName?.replace(/[^a-z0-9.]/gi, "-");
    if ((typeof fileName === "string") && ((operation === "create") || (req.body.filename !== dashedFileName))) {
      if ((typeof req.body.title === 'undefined') || (req.body.title.length === 0)) {
        req.body.title = fileName;
        req.files.file.name = dashedFileName;
      }
      else {
        let splitFileName = fileName.split(".")
        req.files.file.name = req.body.title.replace(/[^a-z0-9.]/gi, "-") + "." + splitFileName[splitFileName.length-1];
      }
    }
  }
}