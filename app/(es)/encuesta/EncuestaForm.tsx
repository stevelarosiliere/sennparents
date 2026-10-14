"use client";

import { useState } from "react";
import Link from "next/link";
import Shield from "@/components/Shield";

export default function EncuestaForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Validate max 3 checkboxes for Q5
    const checked = form.querySelectorAll<HTMLInputElement>(
      'input[name="q5"]:checked'
    );
    if (checked.length === 0) {
      alert("Por favor seleccione al menos una opción para la pregunta 5.");
      return;
    }
    if (checked.length > 3) {
      alert("Por favor seleccione un máximo de 3 opciones para la pregunta 5.");
      return;
    }

    setSubmitting(true);

    const q5values: string[] = [];
    checked.forEach((cb) => {
      q5values.push(cb.value);
    });

    const getRadio = (name: string) =>
      form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)
        ?.value ?? "";

    const payload = {
      type: "survey",
      timestamp: new Date().toISOString(),
      language: "es",
      q1: getRadio("q1"),
      q2: getRadio("q2"),
      q3: getRadio("q3"),
      q4: getRadio("q4"),
      q5: q5values.join(", "),
      q6: getRadio("q6"),
      q7: getRadio("q7"),
      q8: getRadio("q8"),
      q9:
        form.querySelector<HTMLTextAreaElement>('textarea[name="q9"]')?.value ||
        "",
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbxoARfseF_T4vG7df09vjoeN5BSBcdZjd3ZQjimNZLP0vM-fepHndSbDbAwgkk2iLUj/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      setSubmitted(true);
    } catch {
      setSubmitting(false);
      alert(
        "Algo salió mal. Por favor intente de nuevo o envíe un correo a sennparents@gmail.com."
      );
    }
  };

  return (
    <>
      <style>{`
        .enc-header {
            background: var(--green);
            color: var(--white);
            border-radius: 0 0 var(--r-lg) var(--r-lg);
            padding: 2.5rem 1.25rem 2.25rem;
            text-align: center;
        }
        .enc-header svg { width: 48px; margin: 0 auto 0.9rem; }
        .enc-header h1 {
            color: var(--white);
            font-size: clamp(1.4rem, 4vw, 1.8rem);
            font-weight: 900;
            letter-spacing: -0.025em;
        }
        .enc-header p { color: rgba(255,255,255,0.8); font-size: 0.95rem; margin-top: 0.35rem; }
        .enc-header a {
            display: inline-block;
            margin-top: 0.9rem;
            color: var(--gold);
            font-size: 0.85rem;
            font-weight: 700;
            text-decoration: none;
        }

        .container {
            max-width: 640px;
            margin: 2.5rem auto;
            padding: 0 1.25rem;
        }

        .intro {
            background: var(--white);
            border-radius: var(--r);
            border-top: 4px solid var(--gold);
            padding: 1.6rem 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
        }
        .intro h2 { color: var(--green); font-size: 1.15rem; margin-bottom: 0.5rem; }
        .intro p { color: var(--ink-60); font-size: 0.93rem; }

        .question {
            background: var(--white);
            border-radius: var(--r);
            padding: 1.6rem 1.5rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 14px rgba(22,33,26,0.07);
        }
        .question label.q-label {
            display: block;
            font-weight: 700;
            font-size: 1rem;
            line-height: 1.4;
            letter-spacing: -0.01em;
            color: var(--ink);
            margin-bottom: 0.9rem;
        }
        .question .required { color: var(--athletics); }
        .question .chips { margin-bottom: 0; }
        .hint { font-size: 0.82rem; color: var(--ink-60); margin: -0.4rem 0 0.75rem; }

        .opt-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .opt {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.75rem 0.95rem;
            border-radius: 14px;
            background: var(--bone);
            box-shadow: inset 0 0 0 1.5px var(--line);
            font-size: 0.92rem;
            font-weight: 600;
            line-height: 1.4;
            cursor: pointer;
            transition: background 0.15s, color 0.15s, box-shadow 0.15s;
        }
        .opt input { accent-color: var(--green); margin: 0; flex-shrink: 0; }
        .opt:has(input:checked) { background: var(--green); color: var(--white); box-shadow: none; }

        .question textarea { min-height: 110px; resize: vertical; }
        .question .f { margin-bottom: 0; }

        .btn:disabled { opacity: 0.6; cursor: default; transform: none; box-shadow: none; }

        .success {
            text-align: center;
            padding: 3rem 1.5rem;
            background: var(--green-soft);
            border-radius: var(--r);
        }
        .success .icon { font-size: 3rem; margin-bottom: 1rem; }
        .success h2 { color: var(--green); margin-bottom: 0.5rem; }
        .success p { color: var(--ink-60); font-size: 0.95rem; }

        .enc-foot { text-align: center; font-size: 0.85rem; }
        .enc-foot a { text-decoration: none; }
        .enc-foot a:hover { color: var(--gold); }
      `}</style>

      <header className="enc-header">
        <Shield outer="#D4A017" inner="#1B5E20" letter="#D4A017" />
        <h1>Encuesta para Padres de Senn</h1>
        <p>2 minutos. Su voz importa.</p>
        <Link href="/es">&larr; Volver al sitio</Link>
      </header>

      <div className="container">
        <div className="intro">
          <p className="eyebrow">Su voz importa</p>
          <h2>Consejo Asesor de Padres (CAP)</h2>
          <p>
            Esta encuesta nos ayuda a entender lo que las familias de Senn
            realmente necesitan. Sus respuestas guiarán las recomendaciones del
            CAP sobre cómo se gastan los fondos de Título I para la
            participación familiar.
          </p>
        </div>

        {!submitted && (
          <form id="survey-form" onSubmit={handleSubmit}>
            {/* Q1 */}
            <div className="question">
              <label className="q-label">
                1. ¿Cuántos años lleva su hijo/a en Senn?{" "}
                <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="q1" value="Primer año" required />{" "}
                  Primer año
                </label>
                <label className="chip">
                  <input type="radio" name="q1" value="2-3 años" /> 2-3 años
                </label>
                <label className="chip">
                  <input type="radio" name="q1" value="4 años" /> 4 años
                </label>
              </div>
            </div>

            {/* Q2 */}
            <div className="question">
              <label className="q-label">
                2. ¿Ha asistido antes a una reunión del CAP o de gobierno
                escolar? <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="q2" value="Sí" required /> Sí
                </label>
                <label className="chip">
                  <input type="radio" name="q2" value="No" /> No
                </label>
              </div>
            </div>

            {/* Q3 */}
            <div className="question">
              <label className="q-label">
                3. ¿Cuál es la mejor manera de comunicarnos con usted?{" "}
                <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input
                    type="radio"
                    name="q3"
                    value="Correo electrónico"
                    required
                  />{" "}
                  Correo electrónico
                </label>
                <label className="chip">
                  <input type="radio" name="q3" value="Mensaje de texto" />{" "}
                  Mensaje de texto
                </label>
                <label className="chip">
                  <input type="radio" name="q3" value="WhatsApp" /> WhatsApp
                </label>
                <label className="chip">
                  <input type="radio" name="q3" value="Llamada telefónica" />{" "}
                  Llamada telefónica
                </label>
                <label className="chip">
                  <input type="radio" name="q3" value="Volante de la escuela" />{" "}
                  Volante de la escuela
                </label>
              </div>
            </div>

            {/* Q4 */}
            <div className="question">
              <label className="q-label">
                4. ¿En qué idioma prefiere recibir las comunicaciones de la
                escuela? <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="q4" value="Inglés" required />{" "}
                  Inglés
                </label>
                <label className="chip">
                  <input type="radio" name="q4" value="Español" /> Español
                </label>
                <label className="chip">
                  <input type="radio" name="q4" value="Otro" /> Otro
                </label>
              </div>
            </div>

            {/* Q5 */}
            <div className="question">
              <label className="q-label">
                5. ¿Cuáles son las 3 cosas más importantes que su familia
                necesita de Senn? <span className="required">*</span>
              </label>
              <p className="hint">Seleccione hasta 3</p>
              <div className="opt-list">
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Servicios de traducción/interpretación"
                  />{" "}
                  Servicios de traducción/interpretación
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Programas después de la escuela"
                  />{" "}
                  Programas después de la escuela
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Orientación universitaria y profesional"
                  />{" "}
                  Orientación universitaria y profesional
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Salud mental y consejería"
                  />{" "}
                  Salud mental y consejería
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Tutorías y apoyo académico"
                  />{" "}
                  Tutorías y apoyo académico
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Talleres para padres"
                  />{" "}
                  Talleres para padres (educación financiera, herramientas
                  digitales, etc.)
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Mejor comunicación por parte de la escuela"
                  />{" "}
                  Mejor comunicación por parte de la escuela
                </label>
                <label className="opt">
                  <input type="checkbox" name="q5" value="Seguridad" />{" "}
                  Seguridad
                </label>
                <label className="opt">
                  <input
                    type="checkbox"
                    name="q5"
                    value="Apoyo de educación especial"
                  />{" "}
                  Apoyo de educación especial
                </label>
                <label className="opt">
                  <input type="checkbox" name="q5" value="Otro" /> Otro
                </label>
              </div>
            </div>

            {/* Q6 */}
            <div className="question">
              <label className="q-label">
                6. ¿Había escuchado sobre el Consejo Asesor de Padres de Título
                I antes de hoy? <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="q6" value="Sí" required /> Sí
                </label>
                <label className="chip">
                  <input type="radio" name="q6" value="No" /> No
                </label>
              </div>
            </div>

            {/* Q7 */}
            <div className="question">
              <label className="q-label">
                7. ¿Asistiría a una reunión del CAP si se realizara en un
                horario conveniente para usted?{" "}
                <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="q7" value="Sí" required /> Sí
                </label>
                <label className="chip">
                  <input type="radio" name="q7" value="Tal vez" /> Tal vez
                </label>
                <label className="chip">
                  <input type="radio" name="q7" value="No" /> No
                </label>
              </div>
            </div>

            {/* Q8 */}
            <div className="question">
              <label className="q-label">
                8. ¿Qué horario le conviene más para las reuniones?{" "}
                <span className="required">*</span>
              </label>
              <div className="chips">
                <label className="chip">
                  <input type="radio" name="q8" value="Mañana" required />{" "}
                  Mañana
                </label>
                <label className="chip">
                  <input type="radio" name="q8" value="Tarde" /> Tarde
                </label>
                <label className="chip">
                  <input type="radio" name="q8" value="Noche" /> Noche
                </label>
                <label className="chip">
                  <input type="radio" name="q8" value="Fin de semana" /> Fin de
                  semana
                </label>
              </div>
            </div>

            {/* Q9 */}
            <div className="question">
              <label className="q-label">
                9. ¿Hay algo más que quiera que el CAP sepa?
              </label>
              <div className="f">
                <textarea
                  name="q9"
                  placeholder="Escriba su respuesta aquí..."
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-green"
              id="submit-btn"
              disabled={submitting}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {submitting ? "Enviando..." : "Enviar Encuesta"}
            </button>
          </form>
        )}

        {submitted && (
          <div className="success" id="success">
            <div className="icon">&#9989;</div>
            <h2>¡Gracias!</h2>
            <p>
              Su respuesta ha sido registrada. Gracias por compartir lo que su
              familia necesita. El CAP usará esta información para hacer
              recomendaciones informadas.
            </p>
            <p style={{ marginTop: "1rem" }}>
              <Link
                href="/es"
                style={{ color: "var(--green)", fontWeight: 600 }}
              >
                Volver al sitio
              </Link>
            </p>
          </div>
        )}
      </div>

      <footer>
        <div className="wrap enc-foot">
          Senn Parent Advisory Council
          <br />
          <a href="mailto:sennparents@gmail.com">sennparents@gmail.com</a>
        </div>
      </footer>
    </>
  );
}
