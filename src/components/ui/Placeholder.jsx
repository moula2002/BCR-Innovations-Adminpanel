const Placeholder = ({ title, description }) => (
  <div className="h-[60vh] flex items-center justify-center bg-admin-panel border border-admin-border rounded-3xl shadow-sm">
    <div className="text-center max-w-sm px-6">
      <div className="w-20 h-20 bg-bcr-blue-light rounded-full mx-auto mb-6 flex items-center justify-center">
        <span className="text-3xl text-bcr-blue">⚡</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">{title}</h2>
      <p className="text-admin-muted leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

export default Placeholder;
