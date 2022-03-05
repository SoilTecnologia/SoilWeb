import styled from "styled-components";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;
export const Select = styled.select`
  margin: 0.2rem 0 2rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
`;
export const Label = styled.label`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0.5rem;
  color: ${({ theme }) => theme.colors.primary_gradient};
`;
