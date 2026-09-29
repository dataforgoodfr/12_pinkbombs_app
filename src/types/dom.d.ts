import "react";

// `inert` is a standard HTML attribute not yet typed in @types/react 18.
declare module "react" {
  interface HTMLAttributes {
    inert?: boolean;
  }
}
