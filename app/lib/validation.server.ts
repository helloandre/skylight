type ValidatorFunction = (validator: string) => boolean;
type Validator = string | ValidatorFunction;

export type Check = {
  name: string;
  value: string;
  validator?: Validator;
  validators?: Validator[];
  message?: string;
};

export type Validity = Check & {
  valid: boolean;
  message?: string;
};

const VALIDATORS: {
  [validator: string]: ValidatorFunction;
} = {
  username: (u) => typeof u === "string" && u.length >= 3,
  password: (p) => typeof p === "string" && p.length >= 3,
  email: (e) => typeof e === "string" && /.+@.+\..+/.test(e),
  nonempty: (p) => typeof p === "string" && p.length > 0,
};
const MESSAGES: { [checker: string]: string } = {
  username: "Username must be at least 3 characters",
  password: "Password must be at least 3 characters",
  email: "Email is invalid",
  nonempty: "Cannot be empty",
};

function _validate({ value }: Check, validator: Validator) {
  return typeof validator === "string"
    ? VALIDATORS[validator](value)
    : validator(value);
}

export default function validate(checkers: Check[]): Validity[] {
  return checkers.map((f) => {
    const valid = f.validator
      ? _validate(f, f.validator)
      : f.validators
      ? f.validators.map((v) => _validate(f, v)).every(Boolean)
      : false;

    return {
      ...f,
      valid,
      message: valid
        ? undefined
        : f.message ??
          MESSAGES[typeof f.validator === "string" ? f.validator : f.name],
    };
  });
}
