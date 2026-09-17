import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Info, Paperclip, UploadCloud, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function CreateTNF() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sourceVin = params.get("vin");
  const fileRef = useRef<HTMLInputElement>(null);
  const [existing, setExisting] = useState("no");
  const [files, setFiles] = useState<File[]>([]);

  function onFiles(e: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(e.target.files ?? []));
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <form onSubmit={submit}>
      <div className="page-heading compact">
        <div>
          <div className="eyebrow">NEW WRITEUP</div>
          <h1>Create TNF Issue</h1>
          <p>Document what was observed, what was found and the evidence behind it.</p>
        </div>
        <button type="button" className="ghost-button" onClick={() => navigate("/dashboard")}><ArrowLeft size={17} /> Cancel</button>
      </div>

      {sourceVin && <div className="source-vehicle-banner"><strong>TNF originating from tracked vehicle</strong><span>{sourceVin} · Continue the writeup using the investigation findings.</span></div>}
      <div className="stepper">
        <div className="step active"><span>1</span><div><strong>Issue details</strong><small>Vehicle & concern</small></div></div>
        <div className="step-line" />
        <div className="step"><span>2</span><div><strong>Evidence</strong><small>Files & diagnostics</small></div></div>
        <div className="step-line" />
        <div className="step"><span>3</span><div><strong>Review</strong><small>Confirm & submit</small></div></div>
      </div>

      <div className="form-grid">
        <section className="form-card">
          <div className="form-card-header">
            <div className="section-number">01</div>
            <div><h2>Vehicle information</h2><p>Identify the vehicle associated with this issue.</p></div>
          </div>

          <div className="field-grid">
            <label className="field"><span>Vehicle Line <b>*</b></span>
              <select required defaultValue=""><option value="" disabled>Select vehicle line</option><option>Line X</option><option>Line Y</option><option>Line Z</option></select>
            </label>
            <label className="field"><span>Vehicle ID / VIN <b>*</b></span><input required placeholder="e.g. V-1842 or VIN" /></label>
            <label className="field"><span>Model / Build</span><input placeholder="e.g. MY27 • Build 184" /></label>
            <label className="field"><span>Software version</span><input placeholder="e.g. 4.12.7" /></label>
            <label className="field"><span>Mileage</span><input type="number" min="0" placeholder="0" /></label>
          </div>
        </section>

        <section className="form-card">
          <div className="form-card-header">
            <div className="section-number">02</div>
            <div><h2>Issue description</h2><p>Capture the concern and what your investigation found.</p></div>
          </div>

          <div className="field-stack">
            <label className="field"><span>Issue title <b>*</b></span><input required placeholder="Give the issue a concise, searchable title" /></label>
            <label className="field"><span>Observed concern <b>*</b></span><textarea required rows={4} placeholder="What happened? Include symptoms, conditions and when the issue occurred." /></label>
            <label className="field"><span>What was found? <b>*</b></span><textarea required rows={5} placeholder="Describe your findings and troubleshooting performed..." /></label>
            <label className="field"><span>Root cause / resolution</span><textarea rows={4} placeholder="If known, describe the root cause and resolution..." /></label>
          </div>
        </section>

        <section className="form-card">
          <div className="form-card-header">
            <div className="section-number">03</div>
            <div><h2>Existing issue</h2><p>Connect this writeup to an issue already tracked elsewhere.</p></div>
          </div>

          <div className="existing-choice">
            <button type="button" className={existing === "no" ? "choice selected" : "choice"} onClick={() => setExisting("no")}><span className="radio">{existing === "no" && <Check size={12} />}</span><div><strong>No existing issue</strong><small>This appears to be a new issue.</small></div></button>
            <button type="button" className={existing === "yes" ? "choice selected" : "choice"} onClick={() => setExisting("yes")}><span className="radio">{existing === "yes" && <Check size={12} />}</span><div><strong>Yes, link an issue</strong><small>An issue number already exists.</small></div></button>
          </div>

          {existing === "yes" && (
            <label className="field issue-number-field"><span>Existing issue number <b>*</b></span><input required placeholder="e.g. ISSUE-12345" /></label>
          )}
        </section>

        <section className="form-card">
          <div className="form-card-header">
            <div className="section-number">04</div>
            <div><h2>Evidence & attachments</h2><p>Add photos, videos, logs or supporting documents.</p></div>
          </div>

          <input ref={fileRef} type="file" multiple hidden onChange={onFiles} />
          <button type="button" className="upload-zone" onClick={() => fileRef.current?.click()}>
            <span className="upload-icon"><UploadCloud size={24} /></span>
            <strong>Drop files here or click to browse</strong>
            <span>Photos, videos, logs and documents • Multiple files supported</span>
          </button>

          {files.length > 0 && (
            <div className="file-list">
              {files.map((file) => (
                <div className="file-item" key={`${file.name}-${file.size}`}><FileText size={17} /><span>{file.name}</span><small>{Math.ceil(file.size / 1024)} KB</small><button type="button" onClick={() => setFiles(files.filter(f => f !== file))}><X size={15} /></button></div>
              ))}
            </div>
          )}
        </section>

        <div className="form-footer">
          <div className="save-note"><Info size={16} /><span>Your draft can be saved and completed later.</span></div>
          <div className="footer-actions">
            <button type="button" className="ghost-button" onClick={() => navigate("/dashboard")}>Save as draft</button>
            <button type="submit" className="primary-button">Continue to review <ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
    </form>
  );
}
