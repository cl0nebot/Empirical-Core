import * as React from 'react'

const ProjectorModal: React.SFC<{closeModal: any}> = (props) => {
 return <div className="projector-modal-container">
    <div className="projector-modal-background" />
     <div className="projector-modal">
       <div className="top-section">
          <img onClick={props.closeModal} className="exit" src="https://assets.quill.org/images/icons/CloseIcon.svg"/>
          <img className="illustration" src="https://assets.quill.org/images/illustrations/projector_modal.svg" />
          <h1><span>Next:</span> Project this window</h1>
          <p>Project this screen to your students by adjusting your display settings to unmirrored mode so that you can project this window while looking at a different window on your computer.</p>
          <p className="follow-instructions">Drag this window to the left or right of your screen to project.</p>
          <button onClick={props.closeModal}>Got it!</button>
        </div>
        <div className="bottom-section">
          <p className="bottom-section-header">How to adjust your display settings?</p>

          <div className="list-container">
            <div className="list windows-list">
              <p className="list-header">For Windows:</p>
              <p className="list-item"><span>1.</span> Go to Control Panel or right-click on your desktop.</p>
              <p className="list-item"><span>2.</span> Choose Display Settings.</p>
              <p className="list-item"><span>3.</span> Select Extend Desktop from Multiple Display Dropdown.</p>
            </div>

            <div className="list mac-list">
              <p className="list-header">For Macs:</p>
              <p className="list-item"><span>1.</span> Go to System Preferences.</p>
              <p className="list-item"><span>2.</span> Go to Displays.</p>
              <p className="list-item"><span>3.</span> Select the Arrangement tab.</p>
              <p className="list-item"><span>4.</span> Uncheck Mirror Displays.</p>
            </div>
          </div>

        </div>
     </div>
   </div>
}

export default ProjectorModal
