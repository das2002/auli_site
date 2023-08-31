const InfoAlert = ({errMsg, currAlert}) => {

  const alerts = [
    {
      name: "error",
      title: "Error",
      text: (
        <>
          <p>
            {errMsg}
            <br />
            There has been an error. Please review the Cato docs for help
            troubleshooting the issue.
          </p>
          <br />
          <a
      href="https://github.com/aulitech/Cato/wiki"
      className="underline underline-offset-2"
    >
      Cato Wiki
    </a>
        </>
      ),
      color: "yellow",
      svg: (
        <div className="flex-shrink-0 text-yellow-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
      ),
    },
    {
      name: "connectDir",
      title: "Enable Connection with Cato",
      text: (
        <>
          <p>
            <br />
            When you click <strong>Connect Cato</strong> you will be prompted by
            your broswer to select a directory.
          </p>
          <br />
          <p>
            Select the <strong>AULI_CATO</strong> directory from the finder
            window.
          </p>
        </>
      ),
      color: "blue",
      svg: null,
    },
    {
      name: "startRecord",
      title: "Enable Gesture Recording",
      text: (
        <>
          <p>
            <br />
            When you click Start,you will be prompted by your browser, select{" "}
            <strong>View Files</strong>, then select{" "}
            <strong>Save Changes</strong>.
          </p>
        </>
      ),
      color: "blue",
      svg: null,
    },
    {
      name: "nextRecord",
      title: "Enable Gesture Data Capture",
      text: (
        <>
          <p>
            When you click <strong>Next</strong>, a new prompt from your broswer
            will appear. Select <strong>INSTERT TEXT</strong>.
          </p>
        </>
      ),
      color: "blue",
      svg: null,
    },
  ];


  const DisplayAlert = () => {
    let toDisplay;
    alerts.map((alert) => {
      if(alert.name === currAlert) {
        console.log(alert.name)
      }
    })

    return (
      <>
      <p>test</p>
      {/* <div className={`rounded-md w-full bg-${toDisplay.color}-50 p-4`}>
        <div className="flex items-center">
          {toDisplay.svg}
          <div className="ml-3">
            <h3 className={`text-sm font-medium text-${toDisplay.color}-500`}>{toDisplay.title}</h3>
            <div className={`text-sm text-${toDisplay.color}-500`}>
              {toDisplay.text}
            </div>
          </div>
        </div>
      </div> */}
      </>
    )
  }
  return (
    <>
    <DisplayAlert/>
    </>
  )
};


export default InfoAlert;