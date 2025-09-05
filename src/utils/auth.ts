import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type PayloadToken = { username: string };
type VerifyToken = {
  payload?: jwt.JwtPayload | string;
  isSuccessfully: boolean;
};

const hashPassword = (password: string): string => {
  const hashed: string = bcrypt.hashSync(password, 10);

  return hashed;
};

const compereHashedPassword = (password: string, hashed: string): boolean => {
  const isValid: boolean = bcrypt.compareSync(password, hashed);

  return isValid;
};

const generateToken = (payload: PayloadToken): string => {
  const token: string = jwt.sign(
    payload,
    process.env.TOKEN_PRIVATE_KEY as string,
    { expiresIn: "1 days" }
  );

  return token;
};

const verifyToken = (token: string): VerifyToken => {
  try {
    const payload: string | jwt.JwtPayload = jwt.verify(
      token,
      process.env.TOKEN_PRIVATE_KEY as string
    );

    return { isSuccessfully: true, payload };
  } catch (error) {
    return { isSuccessfully: false };
  }
};

export { hashPassword, compereHashedPassword, generateToken, verifyToken };
