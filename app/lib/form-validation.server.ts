type FieldValidator = string | ValidatorFunction;
type ValidatorFunction = (field: string) => boolean;

export type Field = {
  name: string;
  value: string;
  valid?: boolean;
  validator?: FieldValidator;
  validators?: FieldValidator[];
  message?: string;
};

type Validity = {
  name: string;
  valid: boolean;
  message?: string;
};

const VALIDATORS: {
  [field: string]: ValidatorFunction;
} = {
  username: (u) => typeof u === "string" && u.length >= 3,
  password: (p) => typeof p === "string" && p.length >= 3,
  email: (e) => typeof e === "string" && /.+@.+\..+/.test(e),
};
const MESSAGES: { [field: string]: string } = {
  username: "Username must be at least 3 characters",
  password: "Password must be at least 3 characters",
  email: "Email is invalid",
};

function _validate({ value }: Field, validator: FieldValidator) {
  return typeof validator === "string"
    ? VALIDATORS[validator](value)
    : validator(value);
}

export default function validate(fields: Field[]): Validity[] {
  return fields.map((f) => {
    const valid = f.validator
      ? _validate(f, f.validator)
      : f.validators
      ? f.validators.map((v) => _validate(f, v)).every(Boolean)
      : false;

    return {
      ...f,
      message: f.message ?? MESSAGES[f.name],
      valid,
    };
  });
}
