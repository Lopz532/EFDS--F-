#!/usr/bin/env python3
# Funciones.py
# Versión: análisis y graficado estilo GeoGebra + soporte para 1 o 2 funciones
# Requisitos: pip install sympy numpy matplotlib

import os
import re
import csv
import math
import argparse
import numpy as np
import matplotlib.pyplot as plt
from sympy import (
    symbols, sympify, simplify, Eq, solveset, S, lambdify, diff, limit, oo, Abs
)
import sympy as sp

# ---------------- utilidades ----------------
def safe_name(s):
    s2 = re.sub(r'\s+', '', str(s))
    s2 = re.sub(r'[^0-9A-Za-z\-\_\.\(\)\*\+]', '_', s2)
    return s2[:80]

def to_float_safe(v):
    try:
        return float(v)
    except Exception:
        return None

# ---------------- análisis simbólico ----------------
def encontrar_ceros_simbólicos(funcion, x):
    try:
        sol = solveset(Eq(funcion, 0), x, domain=S.Reals)
        return list(sol)
    except Exception:
        return []

def encontrar_ceros_numéricos_por_muestreo(expr, x, xmin, xmax, n_intervals=400, tol=1e-8):
    """Busca ceros numéricos escaneando intervalos y usando nsolve/bisección como fallback."""
    f_np = lambdify(x, expr, 'numpy')
    xs = np.linspace(xmin, xmax, n_intervals+1)
    roots = []
    for i in range(n_intervals):
        a, b = xs[i], xs[i+1]
        try:
            fa = f_np(a); fb = f_np(b)
        except Exception:
            continue
        if not (np.isfinite(fa) and np.isfinite(fb)):
            continue
        # exact zero at endpoint
        if abs(fa) < tol:
            roots.append(a)
        if fa * fb < 0:
            # sign change -> try nsolve near midpoint
            mid = 0.5*(a+b)
            try:
                r = sp.nsolve(expr, x, mid, tol=tol, maxsteps=50)
                rv = to_float_safe(r)
                if rv is not None and xmin - 1e-9 <= rv <= xmax + 1e-9:
                    roots.append(rv)
                    continue
            except Exception:
                # fallback bisection
                ra, rb = a, b
                fa_, fb_ = fa, fb
                for _ in range(50):
                    m = 0.5*(ra+rb)
                    try:
                        fm = f_np(m)
                    except Exception:
                        break
                    if not np.isfinite(fm):
                        break
                    if abs(fm) < tol:
                        roots.append(m); break
                    if fa_ * fm < 0:
                        rb = m; fb_ = fm
                    else:
                        ra = m; fa_ = fm
                else:
                    roots.append(0.5*(a+b))
    uniq = []
    for r in roots:
        if r is None: continue
        if all(abs(r - u) > 1e-5 for u in uniq):
            uniq.append(r)
    uniq.sort()
    return uniq

def dominio_discontinuidades(expr, x):
    """Detecta puntos simbólicos donde denominador = 0."""
    try:
        num, den = expr.as_numer_denom()
        den_sols = solveset(Eq(den, 0), x, domain=S.Reals)
        return list(den_sols)
    except Exception:
        return []

def asiintotas_horizontales_slant(expr, x):
    """Detecta límites en infinito (horizontales) y posible asíntota oblicua (q)."""
    try:
        lim_pos = limit(expr, x, oo)
    except Exception:
        lim_pos = None
    try:
        lim_neg = limit(expr, x, -oo)
    except Exception:
        lim_neg = None

    slant = None
    try:
        num, den = expr.as_numer_denom()
        # división polinómica si es racional
        poly_num = sp.Poly(num, x)
        poly_den = sp.Poly(den, x)
        if poly_num.degree() >= poly_den.degree():
            q, r = divmod(poly_num.as_expr(), poly_den.as_expr())
            q = simplify(q)
            if q != 0:
                slant = q
    except Exception:
        slant = None
    return lim_pos, lim_neg, slant

# ---------------- derivadas y extremos (simbólico) ----------------
def puntos_criticos_simb(expr, x):
    try:
        f1 = diff(expr, x)
        f2 = diff(f1, x)
        pcs = solveset(Eq(f1, 0), x, domain=S.Reals)
        extrema = []
        for p in list(pcs):
            kind = "indeterminado"
            try:
                s = f2.subs(x, p)
                sf = to_float_safe(s)
                if sf is None:
                    kind = "indeterminado"
                elif sf > 0:
                    kind = "minimo"
                elif sf < 0:
                    kind = "maximo"
                else:
                    kind = "posible inflexión"
            except Exception:
                kind = "indeterminado"
            extrema.append((p, kind))
        inflex = list(solveset(Eq(f2, 0), x, domain=S.Reals))
        return {"f1": f1, "f2": f2, "extrema": extrema, "inflexion": inflex}
    except Exception:
        return {"f1": None, "f2": None, "extrema": [], "inflexion": []}

# ---------------- muestreo y detección ----------------
def muestrear_funcion(expr, x, xmin, xmax, npoints=1600):
    f = lambdify(x, expr, modules=["numpy"])
    xs = np.linspace(xmin, xmax, npoints)
    with np.errstate(all='ignore'):
        ys = f(xs)
    ys_out = np.empty_like(xs, dtype=float)
    for i, v in enumerate(ys):
        try:
            if np.isfinite(v):
                ys_out[i] = float(v)
            else:
                ys_out[i] = np.nan
        except Exception:
            ys_out[i] = np.nan
    return xs, ys_out

def detectar_asintotas_verticales_por_muestreo(xs, ys):
    vlines = set()
    for i in range(1, len(xs)):
        if (np.isnan(ys[i]) and np.isfinite(ys[i-1])) or (np.isnan(ys[i-1]) and np.isfinite(ys[i])):
            vlines.add(0.5*(xs[i-1] + xs[i]))
        else:
            if np.isfinite(ys[i]) and np.isfinite(ys[i-1]):
                if abs(ys[i] - ys[i-1]) > max(1e3, 10 * abs(ys[i-1]) + 1):
                    vlines.add(0.5*(xs[i-1] + xs[i]))
    vlist = sorted(list(vlines))
    return vlist

# ---------------- CSV ----------------
def export_csv(xs, ys, filename):
    with open(filename, "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["x", "f(x)"])
        for xi, yi in zip(xs, ys):
            if np.isfinite(yi):
                writer.writerow([f"{xi:.12g}", f"{yi:.12g}"])
            else:
                writer.writerow([f"{xi:.12g}", "NaN"])
    print(f"Tabla exportada a: {filename}")

# ---------------- plotting ----------------
def plot_like_geogebra(expr, x, xs, ys, xmin, xmax, guardar=None, show=True, label=None):
    plt.figure(figsize=(10,6))
    mask = np.isfinite(ys)
    if np.any(mask):
        plt.plot(xs[mask], ys[mask], label=label or f"f(x) = {str(expr)}", linewidth=2)
    plt.axhline(0, color='k', linewidth=0.8)
    plt.axvline(0, color='k', linewidth=0.8)

    # raíces simbólicas y numéricas
    roots_sym = encontrar_ceros_simbólicos(expr, x)
    roots_num = encontrar_ceros_numéricos_por_muestreo(expr, x, xmin, xmax, n_intervals=800)
    roots = []
    for r in roots_sym:
        rf = to_float_safe(r)
        if rf is not None:
            roots.append(rf)
        else:
            try:
                roots.append(float(r.evalf()))
            except Exception:
                pass
    for r in roots_num:
        if all(abs(r - rr) > 1e-5 for rr in roots):
            roots.append(r)
    roots = sorted(roots)
    for r in roots:
        if xmin <= r <= xmax:
            try:
                val = lambdify(x, expr, 'numpy')(r)
                if np.isfinite(val):
                    plt.scatter([r], [val], c='C1', zorder=6)
                    plt.annotate(f"({r:.4g}, {val:.4g})", (r, val), textcoords="offset points", xytext=(6,6), fontsize=8)
            except Exception:
                pass

    # discontinuidades simbólicas y por muestreo
    discos = dominio_discontinuidades(expr, x)
    for d in discos:
        df = to_float_safe(d)
        if df is not None and xmin <= df <= xmax:
            plt.axvline(df, color='gray', linestyle='--', linewidth=1)
            plt.annotate("discont.", (df, 0), textcoords="offset points", xytext=(6,6), fontsize=8)
    vlines = detectar_asintotas_verticales_por_muestreo(xs, ys)
    for v in vlines:
        if xmin <= v <= xmax:
            plt.axvline(v, color='gray', linestyle='--', linewidth=1)

    # horizontales / oblicuas
    lim_pos, lim_neg, slant = asiintotas_horizontales_slant(expr, x)
    for L in (lim_pos, lim_neg):
        if L is not None:
            Lf = to_float_safe(L)
            if Lf is not None and math.isfinite(Lf):
                plt.axhline(Lf, color='C3', linestyle='--', linewidth=1)
                plt.annotate(f"y={Lf:.4g}", (xmin, Lf), textcoords="offset points", xytext=(6,-12), fontsize=8)
    if slant:
        try:
            q = lambdify(x, slant, 'numpy')
            xs_lin = np.array([xmin, xmax])
            ys_lin = q(xs_lin)
            plt.plot(xs_lin, ys_lin, color='C3', linestyle=':', linewidth=1)
            plt.annotate(f"asint. oblicua: {str(slant)}", (xmin, ys_lin[0]), textcoords="offset points", xytext=(6, -16), fontsize=8)
        except Exception:
            pass

    plt.title(f"{label or 'f(x)'}")
    plt.xlabel("x")
    plt.ylabel("f(x)")
    plt.grid(True, linestyle=':', linewidth=0.7)
    plt.legend()
    plt.xlim(xmin, xmax)
    plt.tight_layout()

    if guardar:
        plt.savefig(guardar, bbox_inches='tight', dpi=150)
        print("Gráfica guardada:", guardar)
    if show:
        plt.show()
    plt.close()

# ---------------- main ----------------
def main():
    parser = argparse.ArgumentParser(description="Analizador y graficador estilo GeoGebra (1 o 2 funciones)")
    parser.add_argument("funciones", nargs="+", help='Una o dos funciones en variable x, ej: "x**2" o "sin(x)" "-4*x+6"')
    parser.add_argument("--xmin", type=float, default=-10.0)
    parser.add_argument("--xmax", type=float, default=10.0)
    parser.add_argument("--npoints", type=int, default=1600)
    parser.add_argument("--export", choices=['csv','none'], default='none', help="Exportar tabla a CSV")
    parser.add_argument("--detailed", action='store_true', help="Análisis detallado (derivadas, extremos simbólicos)")
    parser.add_argument("--saveplot", type=str, default=None, help="Guardar PNG o carpeta")
    args = parser.parse_args()

    x = symbols('x')

    # Normalizar funciones pasadas
    funcs = args.funciones
    if len(funcs) > 2:
        print("Solo se aceptan hasta 2 funciones. Usa comillas y pásalas así: \"sin(x)\" \"-4*x+6\"")
        return

    # Caso 1: una función
    if len(funcs) == 1:
        func_raw = funcs[0]
        try:
            expr = sympify(func_raw)
        except Exception as e:
            print("Error al parsear la función:", e); return

        expr_s = simplify(expr)
        print(f"\nFunción simplificada: {expr_s}")

        # paridad
        try:
            expr_negx = simplify(expr_s.subs(x, -x))
            es_par = simplify(expr_negx - expr_s) == 0
            es_impar = simplify(expr_negx + expr_s) == 0
            if es_par:
                print("Paridad: PAR")
            elif es_impar:
                print("Paridad: IMPAR")
            else:
                print("Paridad: NINGUNA")
        except Exception:
            print("Paridad: no se pudo determinar")

        # ceros simbólicos y numéricos
        ceros_sym = encontrar_ceros_simbólicos(expr_s, x)
        ceros_num = encontrar_ceros_numéricos_por_muestreo(expr_s, x, args.xmin, args.xmax, n_intervals=800)
        print("Ceros simbólicos (si aplica):", ceros_sym)
        print("Ceros numéricos (aprox):", ceros_num)

        # f(0)
        try:
            y0 = expr_s.subs(x, 0)
            print("f(0) =", y0)
        except Exception:
            pass

        # discontinuidades / asíntotas
        discos = dominio_discontinuidades(expr_s, x)
        if discos:
            print("Discontinuidades simbólicas (denominador=0):", discos)
        lim_pos, lim_neg, slant = asiintotas_horizontales_slant(expr_s, x)
        if lim_pos is not None:
            print("Límite x->+inf:", lim_pos)
        if lim_neg is not None:
            print("Límite x->-inf:", lim_neg)
        if slant:
            print("Posible asíntota oblicua (q):", slant)

        # derivadas y extremos (opcional)
        if args.detailed:
            det = puntos_criticos_simb(expr_s, x)
            print("\nDerivada f'(x):", det.get('f1'))
            print("Derivada f''(x):", det.get('f2'))
            print("Extremos simbólicos y clasificación:", det.get('extrema'))
            print("Puntos de inflexión simbólicos:", det.get('inflexion'))

        # muestreo numérico y tabla reducida
        xs, ys = muestrear_funcion(expr_s, x, args.xmin, args.xmax, npoints=args.npoints)
        print("\nTabla de valores (muestra ~10 puntos):")
        step = max(1, len(xs)//10)
        print(f"{'x':>12} | {'f(x)':>20}")
        print("-"*36)
        for i in range(0, len(xs), step):
            v = ys[i]
            if np.isfinite(v):
                print(f"{xs[i]:12.6g} | {v:20.12g}")
            else:
                print(f"{xs[i]:12.6g} | {'NaN':>20}")

        # monotonicidad aproximada (simple)
        dy = np.diff(ys)
        if np.any(np.isfinite(dy)):
            sign_changes = np.sum(np.abs(np.sign(dy[:-1]) - np.sign(dy[1:])) > 0)
            print("\nAproximación: cambios de tendencia detectados (num):", int(sign_changes))

        # export CSV si piden
        if args.export == 'csv':
            fname = safe_name(str(expr_s)) + ".csv"
            export_csv(xs, ys, fname)

        # plot
        guardar = args.saveplot
        if guardar and os.path.isdir(guardar):
            guardar = os.path.join(guardar, safe_name(str(expr_s)) + ".png")
        plot_like_geogebra(expr_s, x, xs, ys, args.xmin, args.xmax, guardar=guardar, show=True, label=f"f(x) = {expr_s}")

    # Caso 2: dos funciones -> graficar ambas y buscar intersecciones
    else:
        raw1, raw2 = funcs
        try:
            expr1 = sympify(raw1)
            expr2 = sympify(raw2)
        except Exception as e:
            print("Error al parsear las funciones:", e); return

        xs, ys1 = muestrear_funcion(expr1, x, args.xmin, args.xmax, npoints=args.npoints)
        _, ys2 = muestrear_funcion(expr2, x, args.xmin, args.xmax, npoints=args.npoints)

        plt.figure(figsize=(10,6))
        mask1 = np.isfinite(ys1)
        mask2 = np.isfinite(ys2)
        if np.any(mask1):
            plt.plot(xs[mask1], ys1[mask1], label=f"f1(x) = {simplify(expr1)}", linewidth=2)
        if np.any(mask2):
            plt.plot(xs[mask2], ys2[mask2], label=f"f2(x) = {simplify(expr2)}", linewidth=2, linestyle='--')
        plt.axhline(0, color='k', linewidth=0.8); plt.axvline(0, color='k', linewidth=0.8)
        plt.grid(True, linestyle=':', linewidth=0.7)
        plt.legend()
        plt.title("Comparación de funciones y puntos de intersección")
        plt.xlim(args.xmin, args.xmax)

        # intento simbólico de intersecciones
        try:
            inter_sym = solveset(Eq(expr1, expr2), x, domain=S.Reals)
            inter_list = list(inter_sym)
        except Exception:
            inter_list = []

        # si simbólico vacío o difícil, buscar numéricamente por muestreo de diferencia
        if not inter_list:
            diff_expr = simplify(expr1 - expr2)
            inter_list = encontrar_ceros_numéricos_por_muestreo(diff_expr, x, args.xmin, args.xmax, n_intervals=800)

        # mostrar intersecciones con coordenadas y marcarlas
        inter_coords = []
        for xi in inter_list:
            try:
                xv = to_float_safe(xi)
                if xv is None:
                    xv = float(xi.evalf())
                if xv is None: continue
                if xv < args.xmin - 1e-9 or xv > args.xmax + 1e-9: continue
                # obtener y a partir de f1 (si finito)
                yv = None
                try:
                    yv = float(lambdify(x, expr1, 'numpy')(xv))
                    if not np.isfinite(yv):
                        yv = float(lambdify(x, expr2, 'numpy')(xv))
                except Exception:
                    try:
                        yv = float(expr1.subs(x, xi))
                    except Exception:
                        try:
                            yv = float(expr2.subs(x, xi))
                        except Exception:
                            yv = None
                inter_coords.append((xv, yv))
            except Exception:
                continue

        # eliminar duplicados por tolerancia
        uniq = []
        for (a,b) in inter_coords:
            if all(abs(a - u[0]) > 1e-5 for u in uniq):
                uniq.append((a,b))
        inter_coords = sorted(uniq, key=lambda t: t[0])

        print("Intersecciones (x, y) aproximadas:")
        for (a,b) in inter_coords:
            if b is None:
                print(f" x = {a:.8g}  | y = (no evaluable numéricamente)")
            else:
                print(f" x = {a:.8g}  | y = {b:.12g}")
                plt.scatter([a], [b], color='red', zorder=7)
                plt.annotate(f"({a:.4g}, {b:.4g})", (a,b), textcoords="offset points", xytext=(6,6), fontsize=8)

        # marcar discontinuidades de cada función
        discos1 = dominio_discontinuidades(expr1, x)
        discos2 = dominio_discontinuidades(expr2, x)
        for d in set(discos1 + discos2):
            df = to_float_safe(d)
            if df is not None and args.xmin <= df <= args.xmax:
                plt.axvline(df, color='gray', linestyle='--', linewidth=1)
                plt.annotate("discont.", (df, 0), textcoords="offset points", xytext=(6,6), fontsize=8)

        # guardar si piden
        guardar = args.saveplot
        if guardar:
            if os.path.isdir(guardar):
                fname = safe_name(f"{raw1}_AND_{raw2}") + ".png"
                guardar = os.path.join(guardar, fname)
            plt.savefig(guardar, bbox_inches='tight', dpi=150)
            print("Gráfica guardada:", guardar)

        plt.show()

        # export CSV opcional: generar dos CSVs con tablas de cada función
        if args.export == 'csv':
            fname1 = safe_name(str(simplify(expr1))) + ".csv"
            fname2 = safe_name(str(simplify(expr2))) + ".csv"
            export_csv(xs, ys1, fname1)
            export_csv(xs, ys2, fname2)

if __name__ == "__main__":
    main()
