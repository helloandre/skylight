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
  password: (p) => typeof p === "string" && p.length >= 6,
  email: (e) => typeof e === "string" && /.+@.+\..+/.test(e),
  nonempty: (p) => typeof p === "string" && p.length > 0,
  fullurl: (u) => {
    try {
      new URL(u);
      return true;
    } catch (e) {
      return false;
    }
  },
};
const MESSAGES: { [checker: string]: string } = {
  password: "Password must be at least 6 characters",
  email: "Email is invalid",
  nonempty: "Cannot be empty",
  fullurl: "Must be a complete url, eg. http://example.com",
};

function _validate({ value }: Check, validator: Validator) {
  return typeof validator === "string"
    ? VALIDATORS[validator](value)
    : validator(value);
}

export function validate(checkers: Check[]): Validity[] {
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

export function field(fields: Validity[], name: string) {
  return fields.find((f) => f.name === name);
}

export function setValid(fields: Validity[], valid: Validity) {
  return fields.map((c) => (c.name === valid.name ? valid : c));
}
