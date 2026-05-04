import React from "react";

interface Props {
  code: string;
  confirmUrl: string;
}

export const VerificationUserTemplate = ({
  code,
  confirmUrl,
}: Props): React.JSX.Element => {
  return (
    <div>
      <p>
        Verification code: <strong>{code}</strong>
      </p>

      <p>
        <a href={confirmUrl}>Confirm registration</a>
      </p>
    </div>
  );
};
