import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, FileText, Gavel, BookOpen, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button 
          variant="ghost" 
          className="gap-2" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy & Terms of Use</h1>
          <p className="text-muted-foreground">
            Ethical guidelines, data protection, and usage agreement for the Early Warning and Support System (EWS).
          </p>
        </div>

        <div className="h-[80vh] rounded-md border p-6 bg-card text-card-foreground shadow-sm overflow-y-auto">
          <div className="space-y-8">
            
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <BookOpen className="size-5" />
                1. Ethical Considerations & Overview
              </h2>
              <p className="leading-relaxed">
                This application is an Early Warning and Support System (EWS) designed to identify and support at-risk learners in Rwandan higher education institutions. The system utilizes academic, behavioral, and demographic data to generate predictive risk scores (Graduate vs. Dropout) and shows predictive explanations through integrated XAI explainability which can help teachers and advisors understand the reasons behind the predictions and make more informed decisions and interventions.
              </p>
              <p className="leading-relaxed">
                Because this study handles sensitive student data and influences academic decisions, these ethical considerations are central to ensuring privacy, fairness, and social accountability throughout the system's operation.
              </p>
            </section>

            {/* Data Privacy */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Lock className="size-5" />
                2. Data Privacy, Management, and Confidentiality
              </h2>
              <div className="space-y-2">
                <h3 className="font-medium text-foreground/90">2.1 Data Minimization & Anonymization</h3>
                <p className="text-sm text-muted-foreground">
                  The data processed by this system does not contain direct personal identifiers such as names, student IDs, or contact information. Anonymity is guaranteed at the point of data entry. The system processes the following variables:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                  <li>Academic Metrics: Grades, Units Approved/Evaluated/Enrolled.</li>
                  <li>Demographics: Age at enrollment, Gender.</li>
                  <li>Financial Status: Tuition fee status, Scholarship status, Debtor status.</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-foreground/90">2.2 Security Measures</h3>
                <p className="text-sm text-muted-foreground">
                  All sensitive data is stored securely. Access is strictly restricted to authorized researchers and support staff under signed confidentiality agreements. The system implements encryption standards to protect data at rest and in transit.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-foreground/90">2.3 Legal Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Our data handling procedures comply with the <strong>Rwanda Data Protection and Privacy Law No. 058/2021</strong> (Government of Rwanda, 2021), ensuring lawful processing of personal and academic data.
                </p>
              </div>
            </section>

            {/* Participant Welfare */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Shield className="size-5" />
                3. Participant Welfare & Sensitivity
              </h2>
              <p className="leading-relaxed">
                <strong>Support, Not Punishment:</strong> The system is designed exclusively as a supportive tool to facilitate mentorship and focused interventions. It is not a punitive tool.
              </p>
              <p className="leading-relaxed">
                <strong>Labeling & Interpretation:</strong> We acknowledge the ethical concern regarding the "at-risk" categorization. To mitigate negative labeling effects:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground ml-4">
                <li>Model outputs are probabilistic (risk scores), not absolute judgments.</li>
                <li>Results are visible only to authorized support staff.</li>
                <li>System feedback focuses on development and personalized support strategies rather than deficits or failure.</li>
              </ul>
            </section>

            {/* Academic Integrity */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <Gavel className="size-5" />
                4. Academic & Professional Integrity
              </h2>
              <p className="leading-relaxed">
                The predictive models are built upon open-source algorithms (including Logistic Regression and Decision Tree Classifiers). All reused code and tools are properly cited in accordance with open-source licensing requirements.
              </p>
              <p className="leading-relaxed">
                The study has received ethical clearance from the relevant University Research Ethics Committee. Any anomalies or inefficiencies revealed by the system in existing institutional processes will be treated with discretion and shared constructively to improve student support systems.
              </p>
            </section>

            {/* Regulatory Frameworks */}
            <section className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <FileText className="size-5" />
                5. Regulatory Frameworks
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-medium mb-2">Local Frameworks</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Rwanda National Ethics Committee (RNEC) Guidelines</li>
                    <li>• Rwanda Data Protection and Privacy Law No. 058/2021</li>
                    <li>• National Council for Science and Technology (NCST) Policy (2019)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-medium mb-2">International Frameworks</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• UNESCO Recommendation on the Ethics of AI (2021)</li>
                    <li>• OECD Principles on Artificial Intelligence (2019)</li>
                    <li>• The Belmont Report (1979) - Respect, Beneficence, Justice</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Disclaimer & Limitations */}
            <section className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                <AlertTriangle className="size-5" />
                6. Disclaimer & Limitations
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg border text-sm">
                  <h3 className="font-semibold text-primary mb-2">System Imperfection & Human Oversight</h3>
                  <p className="leading-relaxed text-foreground/90">
                    Most importantly, this system is not perfect and should be used with care. Similar to any prediction tool, it contains its own set of built-in biases based on the data it has learned and will be incorrect sometimes. <strong>The predictions are useful indicators, not absolute truths.</strong> It is advisable to never make decisions based only on what the system says. Teachers and advisors need to use their own judgment, see the entire picture of the situation of each student, and view the system as a tool among many, rather than the end-all solution. Relying too heavily on automated scores without thinking critically could mean giving the wrong kind of help or missing students who need support.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-foreground/90">Specific Limitations</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-2">
                    <li>
                      <strong>Data Scope:</strong> The model was trained on a limited dataset (4,424 records), which may not generalize perfectly to all institutions with different student populations or grading systems.
                    </li>
                    <li>
                      <strong>Binary Classification:</strong> The current framework simplifies outcomes to "graduate vs. dropout", potentially omitting intermediate states like "enrolled" or "transferred".
                    </li>
                    <li>
                      <strong>Feature Availability:</strong> The model relies on specific features (grades, demographics) and may lack richer context such as attendance patterns, assignment submissions, or psychosocial factors that could influence outcomes.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Terms of Use */}
            <section className="space-y-3 pt-4 border-t">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-primary">
                7. Terms of Use
              </h2>
              <p className="text-sm text-muted-foreground">
                By accessing and using this application, you agree to:
              </p>
              <ol className="list-decimal list-inside text-sm text-muted-foreground ml-4 space-y-1">
                <li>Maintain strict confidentiality of all student data accessed through the system.</li>
                <li>Use the predictive insights solely for the purpose of academic support and intervention planning.</li>
                <li>Not attempt to de-anonymize or reverse-engineer student identities from the aggregated data.</li>
                <li>Report any potential data breaches or ethical concerns immediately to the system administrators.</li>
              </ol>
            </section>

            <div className="pt-8 text-xs text-center text-muted-foreground">
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
              <p>© {new Date().getFullYear()} EWS ProjectML. All rights reserved.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

