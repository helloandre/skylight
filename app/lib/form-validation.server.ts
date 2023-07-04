type ValidatorFunction = (validator: string) => boolean;
type Validator = string | ValidatorFunction;

export type Checker = {
  name: string;
  value: string;
  valid?: boolean;
  validator?: Validator;
  validators?: Validator[];
  message?: string;
};

type Validity = {
  name: string;
  valid: boolean;
  message?: string;
};

const VALIDATORS: {
  [validator: string]: ValidatorFunction;
} = {
  username: (u) => typeof u === "string" && u.length >= 3,
  password: (p) => typeof p === "string" && p.length >= 3,
  email: (e) => typeof e === "string" && /.+@.+\..+/.test(e),
  nonempty: (p) => typeof p === "string" && p.length >= 0,
};
const MESSAGES: { [checker: string]: string } = {
  username: "Username must be at least 3 characters",
  password: "Password must be at least 3 characters",
  email: "Email is invalid",
  nonempty: "Cannot be empty",
};

function _validate({ value }: Checker, validator: Validator) {
  return typeof validator === "string"
    ? VALIDATORS[validator](value)
    : validator(value);
}

export default function validate(checkers: Checker[]): Validity[] {
  return checkers.map((f) => {
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
