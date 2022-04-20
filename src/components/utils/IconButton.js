import styled from "styled-components";
import IconButton from '@mui/material/IconButton';

export default styled(IconButton)`
  && {
    color: ${({ theme }) => theme.stats};
    background-color: none;
    font-size: 16px;
  }
`;