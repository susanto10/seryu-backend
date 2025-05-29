import YAML from "yamljs";
const swaggerDocument = YAML.load("./src/swagger/base.yaml");
export default swaggerDocument;