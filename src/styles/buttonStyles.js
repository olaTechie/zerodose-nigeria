// Editorial toggle pair — square corners (rounded-sm), no pill.
// Inactive is a 1 px hairline tag; active is a solid primary fill. Matches design brief §6.
export const activeToggleBtn = {
  padding: '0.4rem 0.85rem',
  borderRadius: '6px',
  border: '1px solid #003d1e',
  cursor: 'pointer',
  fontSize: '0.8125rem',
  fontWeight: 500,
  background: '#003d1e',
  color: '#ffffff',
  fontFamily: 'inherit',
};

export const inactiveToggleBtn = {
  ...activeToggleBtn,
  background: 'transparent',
  color: '#003d1e',
};
