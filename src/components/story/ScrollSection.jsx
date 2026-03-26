import { Scrollama, Step } from 'react-scrollama';

export default function ScrollSection({ stickyContent, steps = [], onStepEnter, onStepProgress }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {/* Sticky visual panel */}
        <div
          style={{
            flex: '1 1 55%',
            position: 'sticky',
            top: '2rem',
            height: 'calc(100vh - 4rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {stickyContent}
        </div>

        {/* Scrolling narrative panel */}
        <div style={{ flex: '1 1 40%', paddingTop: '30vh', paddingBottom: '50vh' }}>
          <Scrollama
            onStepEnter={onStepEnter}
            onStepProgress={onStepProgress}
            offset={0.5}
          >
            {steps.map((step, i) => (
              <Step key={i} data={i}>
                <div
                  className="scroll-narrative glass-card"
                  style={{
                    marginBottom: '50vh',
                    padding: '1.5rem',
                    maxWidth: '420px',
                  }}
                >
                  {step}
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>
      </div>
    </div>
  );
}
