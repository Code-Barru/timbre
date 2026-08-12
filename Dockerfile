FROM node:22-slim AS frontend-builder
WORKDIR /frontend-build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM rust:1.97-slim AS backend-builder
WORKDIR /backend-build
COPY backend/Cargo.toml backend/Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs \
    && cargo build --release \
    && rm -rf src
COPY backend/ ./
RUN touch src/main.rs && cargo build --release

FROM gcr.io/distroless/cc-debian12:nonroot AS runtime
WORKDIR /app
COPY --from=backend-builder /backend-build/target/release/timbre /app/timbre
COPY --from=frontend-builder /frontend-build/build /app/static
EXPOSE 3000
ENTRYPOINT ["/app/timbre"]
