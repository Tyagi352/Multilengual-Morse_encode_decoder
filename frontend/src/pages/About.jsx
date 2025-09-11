import React from 'react';

const About = () => {
  return (
    <div className="p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">About Morse Code Encoder</h2>
          <div className="space-y-4">
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="my-accordion-3" checked="checked" /> 
              <div className="collapse-title text-xl font-medium">
                What is Morse Code?
              </div>
              <div className="collapse-content"> 
                <p>Morse code is a method of encoding text characters using standardized sequences of two different signal durations, called dots and dashes. It was developed by Samuel Morse and Alfred Vail in the 1830s.</p>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="my-accordion-3" /> 
              <div className="collapse-title text-xl font-medium">
                Features
              </div>
              <div className="collapse-content"> 
                <ul className="list-disc list-inside space-y-2">
                  <li>Support for multiple Indian languages</li>
                  <li>Real-time encoding and decoding</li>
                  <li>File upload support</li>
                  <li>History tracking</li>
                  <li>PDF and TXT export options</li>
                </ul>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="my-accordion-3" /> 
              <div className="collapse-title text-xl font-medium">
                Supported Languages
              </div>
              <div className="collapse-content"> 
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="badge badge-primary">English</div>
                  <div className="badge badge-primary">Hindi</div>
                  <div className="badge badge-primary">Gujarati</div>
                  <div className="badge badge-primary">Marathi</div>
                  <div className="badge badge-primary">Tamil</div>
                  <div className="badge badge-primary">Telugu</div>
                  <div className="badge badge-primary">Bengali</div>
                  <div className="badge badge-primary">Kannada</div>
                  <div className="badge badge-primary">Malayalam</div>
                  <div className="badge badge-primary">Punjabi</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Project Team</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Replace with actual team member information */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                      <span className="text-xl">JP</span>
                    </div>
                  </div>
                  <h3 className="card-title">Arnav Tyagi</h3>
                  <p className="text-sm">Project Lead</p>
                </div>
              </div>
            </div>
          </div>

          <div className="divider my-8">Technology Stack</div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Frontend</div>
                <div className="stat-value text-primary">React</div>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Backend</div>
                <div className="stat-value text-secondary">Python</div>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">UI Framework</div>
                <div className="stat-value text-accent">DaisyUI</div>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Database</div>
                <div className="stat-value">SQLite</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
