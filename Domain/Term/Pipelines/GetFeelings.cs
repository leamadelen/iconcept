// FeelingPipeline.cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;

using iconcept.Domain.Term;

namespace iconcept.Domain.Term.Pipelines;
public class GetFeelingsPipeline
{
    public record Request : IRequest<List<Feeling>> { }

    public class Handler : IRequestHandler<Request, List<Feeling>>
    {
        private readonly ConceptDbContext _db;

        public Handler(ConceptDbContext db)
        {
            _db = db ?? throw new ArgumentNullException(nameof(db));
        }

        public async Task<List<Feeling>> Handle(Request request, CancellationToken cancellationToken)
            => await _db.Feelings.ToListAsync(cancellationToken);
    }

}
